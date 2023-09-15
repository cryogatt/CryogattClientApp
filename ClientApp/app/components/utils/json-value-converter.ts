export class JsonValueConverter {

  // Used for debugging .html
  toView(obj) {

    if (obj) {

      return JSON.stringify(obj, null, 2);
    }
  }
}