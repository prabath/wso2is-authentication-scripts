var allowedRoles = ['pickup-admin', 'pickup-user'];
var rolesForFido = ['pickup-admin'];
var is9445IpdIP = ['192.168.1.2','192.168.1.3'];

function onLoginRequest(context) {
	var userip = context.request.ip;
	if (is9445IpdIP.indexOf(userip) > -1 ) {
		executeStep(4);
	} else {
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
					var firstName = user.remoteClaims.first_name;
					var lastName = user.remoteClaims.last_name;
					user.remoteClaims.full_name = firstName + ' ' + lastName;
				}
			}
		});
	}
}
