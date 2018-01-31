var setUserAndPassword = function () {
	document.getElementById("steamAccountName").value='#steam_id#';
	document.getElementById("steamPassword").value='#steam_password#';
};
var loginFun = function () {
	setUserAndPassword();
	document.getElementById("SteamLogin").click();
};
loginFun();
