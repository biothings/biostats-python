let initalState ={
  user: {},
  mapData: [],
  chartData: []
}

const rootReducer = (state = initalState, action) => {
  // console.log('reducer action: ', action);
  switch (action.type) {
    case "UPDATE-CHART":
      return Object.assign({}, state, { chartData: action.payload });
      break;
    case "UPDATE-MAP":
      return Object.assign({}, state, { mapData: action.payload });
      break;
    default:
      return state
  }
}

export default rootReducer;
