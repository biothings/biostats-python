let initalState ={
  mapData: [],
  chartData: []
}

const rootReducer = (state = initalState, action) => {
  switch (action.type) {
    case "UPDATE-CHART":
      return Object.assign({}, state, { chartData: action.payload.slice() });
      break;
    case "UPDATE-MAP":
      return Object.assign({}, state, { mapData: action.payload });
      break;
    default:
      return state
  }
}

export default rootReducer;
