// system should have two roles pickup-admin and pickup-user
// three steps engaged with the corresponding service provider: username/password (step-1), OTP over SMS (step-2), FIDO U2F (step-3)

var allowedRoles = ['pickup-admin', 'pickup-user'];
var rolesForFido = ['pickup-admin'];

function onLoginRequest(context) {
	executeStep(1, {
		onSuccess: function (context) {
			var user = context.steps[1].subject;
			var isAllowed = hasAnyOfTheRoles(user, allowedRoles);

			if (!isAllowed) {
        // redirects to an error page.
				sendError('http://carpooling.com:8080/oidc-web-app-pickup/', {});
			}
			var useFido = hasAnyOfTheRoles(user, rolesForFido);

			if (useFido) {
				executeStep(3);
			} else {
				executeStep(2);
			}
		}
	});
}
