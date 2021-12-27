import { openFile, saveFile } from './VXsFileUtils'

class Profile {
  static instance = new Profile();
  static loadProfileOnline() {

  }
  static saveProfileOnline() {

  }
  static loadProfileOffline() {
    openFile(content => {
      let model = JSON.parse(content);
      this.instance = new Profile(model)
    }, this);
  }
  static saveProfileOffline() {
    saveFile(this.name, JSON.stringify(this.instance));
  }

  constructor(model) {
    if (arguments.length < 1) model = {};
    ({
      name: this.name
    } = model);
  }
}

export default Profile;