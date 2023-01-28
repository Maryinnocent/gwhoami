function myLocalStorage () {
    this.login = 'GWHOAMI_LOGIN';
}
myLocalStorage.prototype.setLoginInfo = function(data) {
    localStorage.setItem(this.login, JSON.stringify(data));
}
myLocalStorage.prototype.getLoginInfo = function() {  return JSON.parse(localStorage.getItem(this.login)||'{}'); }
myLocalStorage.prototype.getUserId = function() {  return JSON.parse(localStorage.getItem(this.login)||'{}')._id; }
myLocalStorage.prototype.empty = function() {  localStorage.clear(); }
myLocalStorage.prototype.getShortName = function() {  
    if (this.getLoginInfo().accessType === 0) return "AD";
    else return `${this.getLoginInfo().firstName.charAt(0)}${this.getLoginInfo().lastName.charAt(0)}`;
}
myLocalStorage.prototype.getFullName = function() {
    return `${this.getLoginInfo().firstName} ${this.getLoginInfo().lastName}`;
}
myLocalStorage.prototype.setProfilePic = function(ext) {
    const info = this.getLoginInfo();
    info.logo_path = ext;
    localStorage.setItem(this.login, JSON.stringify(info));
}
myLocalStorage.prototype.getProfilePic = function() {return this.getLoginInfo().logo_path||'';}
myLocalStorage.prototype.isAdmin = function() {
    return this.getLoginInfo().accessType === 1;
}
myLocalStorage.prototype.isLoggedIn = function() {
    return localStorage.getItem(this.login) !== null;
}
const MyLocalStorage = new myLocalStorage();
export default MyLocalStorage;