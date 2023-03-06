String.prototype.toPascalCase = function () {
    let s = "";
    for (let i = 0; i < this.length; i++) {
        if (i == 0 || this.charAt(i - 1) == " ") {
            s = s + this.charAt(i).toUpperCase();
        } else {
            s = s + this.charAt(i).toLowerCase();
        }
    }
    return s;
};
