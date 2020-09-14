import Route from '@ember/routing/route';
import ResetScroll from '../mixins/routers/reset-scroll';

export default Route.extend(ResetScroll, {
  resetController: function(controller, isExiting) {
    if (isExiting) {
      var queryParams = controller.queryParams;

      // If query params were defined as hash params they come through in an Object
      if (queryParams.toString().slice(0, 15) === '[object Object]') {
        queryParams = Object.keys(queryParams[0]);
      }

      // Set each param to null
      queryParams.forEach(param => {
        controller.set(param, null);
      });
    }
  },
});
