let initalState ={
  mapData: [],
  chartData: [],
  mapData100:[]
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
    default:
      return state
  }
}

export default rootReducer;
