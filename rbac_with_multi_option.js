var allowedRoles = ['pickup-admin', 'pickup-user'];
var rolesForFido = ['pickup-admin'];

function onLoginRequest(context) {

	executeStep(1, {
		onSuccess: function (context) {

			var idp = context.steps[1].idp;
			var user = context.steps[1].subject;

			if (idp == 'LOCAL') {
				var inAllowedRoles = hasAnyOfTheRoles(user, allowedRoles);
				if (!inAllowedRoles) {
					sendError('http://carpooling.com:8080/oidc-web-app-pickup/', {});
				}
				var useFido = hasAnyOfTheRoles(user, rolesForFido);

				if (useFido) {
					executeStep(3);
				} else {
					executeStep(2);
				}
			} else {
				// don't do anything if the idp is not local
			}
		}
	});
}
