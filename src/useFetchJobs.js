import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
    GET_DATA: 'get-data',
    MAKE_REQUEST: 'make-request',
    ERROR: 'error',
    HAS_NEXT_PAGE: 'has-next-page'
}

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';
// const BASE_URL = 'https://api.allorigins.win/raw?url=https://jobs.github.com/positions.json?';

function reducer(state, action) {  //we have access to current state, action: object passed down to dispatch(). Returns new state to be set.
    switch(action.type) {
        case ACTIONS.MAKE_REQUEST:
            return {loading: true, jobs: []};
        case ACTIONS.GET_DATA:   
            return {...state, loading: false, jobs: action.payload.jobs};
        case ACTIONS.ERROR:
            return {...state, loading: false, error: action.payload.error, jobs: []};
        case ACTIONS.HAS_NEXT_PAGE:
            return {...state, hasNextPage: action.payload.hasNextPage};
        default:
            return state;
    }
}

export default function(params, page) {
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });  //alternate to useState, useReducer takes in reducer function and initial state.

    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST }); //make request
        const cancelToken1 = axios.CancelToken.source();
        axios.get(BASE_URL, {
            cancelToken: cancelToken1.token,
            params: {markdown: true, page: page, ...params}
        }).then(res => { //after getting data, populate state's job array with jobs
            dispatch({
                type: ACTIONS.GET_DATA,
                payload: {
                    jobs: res.data
                }
            });
        }).catch(e => {
            if(axios.isCancel(e)) return;
            dispatch({
                type: ACTIONS.ERROR,
                payload: {
                    error: e
                }
            });
        });

        const cancelToken2 = axios.CancelToken.source();
        axios.get(BASE_URL, {
            cancelToken: cancelToken2.token,
            params: {...params, markdown: true, page: page + 1}
        }).then(res => { //after getting data, populate state's job array with jobs
            dispatch({
                type: ACTIONS.HAS_NEXT_PAGE,
                payload: {
                    hasNextPage: res.data.length !== 0
                }
            });
        }).catch(e => {
            if(axios.isCancel(e)) return;
            dispatch({
                type: ACTIONS.ERROR,
                payload: {
                    error: e
                }
            });
        });

        return () => {  //returned function runs everytime dependencies change, for clean-up
            cancelToken1.cancel();
            cancelToken2.cancel();
        };
    }, [params, page]);  //everytime params change, make a new request to api.

    return state;
}