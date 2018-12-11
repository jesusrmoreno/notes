import React, { useEffect, useState } from "react";
import memoize from "lodash/memoize";
import crossfilter from "crossfilter2";
import flatten from "lodash/flatten";
import unionBy from "lodash/unionBy";
import isEqual from "lodash/isEqual";

const EMPTY_RESULTS = [];
/**
 * Using a dimensions object of shape {key: object => object.property } we take the key and generate
 * two objects, filter and dimensionFilters.
 *
 * filter is an object of quick single dimension filters that performs clean up so that we don't have to worry about
 * crossfilter state.
 *
 * dimensionFilters on the other hand is an object of functions that take a predicate function, these functions
 * should be used with the returned applyDimensionFilters function to create different combinations of filters.
 *
 * Example:
 * given a dimensions object { name: object => object.name, age: object => object.age }
 * we would return
 * filter: { name, age }
 * dimensionFilters: { name, age }
 * intersection: filters => {};
 * union: filters => {};
 *
 * We could then use:
 * const canVote = filters.age(age => age >= 18);
 * const isJ = filters.name(name => name.includes('J'));
 *
 * or if we wanted to find people who can vote and have the letter j in their name
 * const canVoteAndContainsJ = intersection([
 *    dimensionFilters.name(name => name.includes('j')),
 *    dimensionFilters.age(age => age >= 18)
 * ])
 * @param {object} params - The configuration object for the crossfilter instance
 * @param {array} params.data - The data that we'll be initializing crossfilter on.
 * @param {object} params.dimensions - An object that will be used to create filters and dimensions
 */
const createCrossfilter = memoize(function({ data, dimensions }) {
  const cs = crossfilter(data);
  const filter = {};
  const dimensionFilters = {};

  Object.entries(dimensions).forEach(([key, value]) => {
    // create dimension

    const dim = cs.dimension(value);
    // create combinable dimension filters,
    // this will let us use our applyDimensions
    // function later on
    dimensionFilters[key] = filter => {
      return () => {
        return dim.filter(filter);
      };
    };

    // generate single dimension filter.
    filter[key] = (filterBy, count = Infinity) => {
      const results = dim.filter(filterBy).top(count);
      dim.filterAll();
      return results.length ? results : EMPTY_RESULTS;
    };
  });

  const union = (dimensionsToApply, resolver) => {
    if (!dimensionsToApply.length) {
      return data;
    }
    // We want to allow the user to pass in null filters to support the use
    // case where a filter should not be applied until a certain condition is met.
    const finalDims = dimensionsToApply.filter(dim => !!dim);
    if (!finalDims.length) {
      return data;
    }
    const collectedResults = flatten(
      finalDims.map(applyDimension => {
        const d = applyDimension();
        const results = d.top(Infinity);

        // clear out filter
        d.filterAll();
        return results;
      })
    );
    // Make sure to clear out all of the filters.
    finalDims.forEach(d => d().filterAll());
    return unionBy(collectedResults, resolver);
  };

  const intersection = (dimensionsToApply = []) => {
    if (!dimensionsToApply.length) {
      return data;
    }
    // We want to allow the user to pass in null filters to support the use
    // case where a filter should not be applied until a certain condition is met.
    const finalDims = dimensionsToApply.filter(dim => !!dim);
    if (!finalDims.length) {
      return data;
    }
    finalDims.forEach(applyDimension => applyDimension());
    // get the final results
    const results = cs.allFiltered();
    // Make sure to clear out all of the filters.
    finalDims.forEach(d => d().filterAll());

    const retVal = results.length ? results : EMPTY_RESULTS;
    return retVal;
  };

  return [filter, dimensionFilters, intersection, union];
});

export const observableCrossfilter = () => {
  const Context = React.createContext();

  class CrossfilterProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = { cs: this.cs() };
    }

    componentDidUpdate({ data, dimensions }) {
      if (this.props.data !== data || this.props.dimensions !== dimensions) {
        this.setState({ cs: this.cs() });
      }
    }

    cs = () => {
      const { data, dimensions } = this.props;
      const [filter, dimension, intersection, union] = createCrossfilter({
        data,
        dimensions
      });
      return {
        filter,
        dimension,
        intersection,
        union
      };
    };

    render() {
      return (
        <Context.Provider value={this.state.cs}>
          {this.props.children}
        </Context.Provider>
      );
    }
  }

  const withCrossfilter = C => props => (
    <Context.Consumer>{cs => <C {...props} _cs={cs} />}</Context.Consumer>
  );

  // So that we can have multiple reducers on the same crossfilter instance
  // personally I'd just use subscribe() to create different selectors
  // off of one main reducer but ¯\_(ツ)_/¯
  const createReducer = (fn, s) => {
    const subscribers = new Set();
    class Reducer extends React.Component {
      componentDidMount() {
        this.applyReducer();
      }

      componentDidUpdate(prevProps) {
        if (!isEqual(prevProps, this.props)) {
          this.applyReducer();
        }
      }

      applyReducer = () => {
        const { filter, dimension, intersection, union } = this.props._cs;
        const props = this.props;

        const results = fn({ filter, dimension, intersection, union }, props);
        subscribers.forEach(v => v(results));
      };

      render() {
        return null;
      }
    }

    const useDerivedValue = (mapResults = res => res) => {
      const [results, setResults] = useState(EMPTY_RESULTS);
      useEffect(() => {
        subscribers.add(setResults);
        return () => subscribers.delete(setResults);
      }, []);
      return mapResults(results);
    };

    return [withCrossfilter(Reducer), useDerivedValue];
  };

  return [CrossfilterProvider, createReducer];
};
