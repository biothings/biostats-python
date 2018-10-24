let initalState ={
  mapData: [],
  chartData: [],
  mapData100:[],
  mgHistory:['','','','',''],
  mcHistory:['','','','',''],
  mvHistory:['','','','',''],
  btHistory:['','','','',''],
  mgMap:[],
  mcMap:[],
  mvMap:[],
  mgReq:0,
  mcReq:0,
  mvReq:0,
}

const rootReducer = (state = initalState, action) => {
  switch (action.type) {
    case "UPDATE-CHART":
      return Object.assign({}, state, { chartData: action.payload.slice() });
      break;
    case "UPDATE-MAP":
      return Object.assign({}, state, { mapData: action.payload });
      break;
    case "UPDATE-MAP-100":
      return Object.assign({}, state, { mapData100: action.payload });
      break;
    case "PUSH-TO-MGHISTORY":
      let arr = state.mgHistory;
      arr.splice(-1,1)
      arr.unshift(action.payload);
      return Object.assign({}, state, { mgHistory: arr.slice() });
      break;
    case "PUSH-TO-MCHISTORY":
      let arr1 = state.mcHistory;
      arr1.splice(-1,1)
      arr1.unshift(action.payload);
      return Object.assign({}, state, { mcHistory: arr1.slice() });
      break;
    case "PUSH-TO-MVHISTORY":
      let arr2 = state.mvHistory;
      arr2.splice(-1,1)
      arr2.unshift(action.payload);
      return Object.assign({}, state, { mvHistory: arr2.slice() });
      break;
    case "PUSH-TO-BTHISTORY":
      let arr3 = state.btHistory;
      arr3.splice(-1,1)
      arr3.unshift(action.payload);
      return Object.assign({}, state, { btHistory: arr3.slice() });
      break;
    case "MG-MAP":
      return Object.assign({}, state, { mgMap: action.payload });
      break;
    case "MC-MAP":
      return Object.assign({}, state, { mcMap: action.payload });
      break;
    case "MV-MAP":
      return Object.assign({}, state, { mvMap: action.payload });
      break;
    case "MG-REQUESTS":
      return Object.assign({}, state, { mgReq: parseInt(action.payload) });
      break;
    case "MC-REQUESTS":
      return Object.assign({}, state, { mcReq: parseInt(action.payload) });
      break;
    case "MV-REQUESTS":
      return Object.assign({}, state, { mvReq: parseInt(action.payload) });
      break;
    default:
      return state
  }
}

export default rootReducer;
