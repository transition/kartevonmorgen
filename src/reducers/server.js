import T from "../constants/ActionTypes";
import Logger from '../util/Logger';

const initialState = {
  version: null,
  entries: {},
  ratings: {},
  loadingSearch: false,
  entriesLoading: false,
  entriesLoaded: false,
};

module.exports = (state=initialState, action={}) => {

  const { payload } = action;

  let entriesById = {};

  switch (action.type) {
    case T.ENTRIES_LOADING:
      return {
        ...state,
        entriesLoading: true,
      };

    case T.ENTRIES_LOADED:
      return {
        ...state,
        entriesLoading: false,
        entriesLoaded: true,
      };

    case T.SERVER_INFO_RESULT:
      return {
        ...state,
        version: payload.version
      };

    case T.ENTRIES_RESULT:
      if(action.error) {
        Logger.error('[ENTRIES RESULT]', action);
        return state;
      }
      if (payload != null) {
        // Multiple entries
        if (Array.isArray(payload)) {
          payload.filter(e => e !== null)
           .forEach(e => { entriesById[e.id] = e; });
        } else {
          // Single entry
          entriesById[payload.id] = payload;
        }
        Logger.log(
          '[STORE] Has:', Object.keys(state.entries).length,
          'Receives:', Object.keys(entriesById).length,
          'Total:', Object.keys(state.entries).length + Object.keys(entriesById).length)

        return {
          ...state,
          entries: {
            ...state.entries,
            ...entriesById
          },
        };
      }
      return state;

    case T.RATINGS_RESULT:
      if(action.error) {
        console.error('[RATINGS RESULT]', action);
        return state;
      }
      if (payload != null) {
        if (Array.isArray(payload)) {
          payload.filter(e => e != null)
           .forEach(e => { entriesById[e.id] = e; });
        } else {
          entriesById[payload.id] = payload;
        }
        return {
          ...state,
          ratings: {
            ...state.ratings,
            ...entriesById
          }
        };
      }
      return state;

    case T.NEW_ENTRY_RESULT:
      entriesById[payload.id] = payload;
      return {
        ...state,
        entries: {
          ...state.entries,
          ...entriesById
        }
      }

    case T.SAVED_ENTRY_RESULT:
      entriesById[payload.id] = payload;
      return {
        ...state,
        entries: {
          ...state.entries,
          ...entriesById
        }
      }

    case T.SET_SEARCH_TIME:
      return {
        ...state,
        loadingSearch: (payload===null) ? true : false
      }

    case T.SEARCH_RESULT:
      return {
        ...state,
        loadingSearch: false
      }
      
    default:
      return state;
  }
};
