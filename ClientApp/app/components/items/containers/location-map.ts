import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { PrimaryContainers } from '../containers/primary_containers';
import { Resources } from '../../resources';

// Represents the locations in a box of vials
@transient()
@autoinject()
export class LocationMap {

  // Box positions - [0][0] is alsways occupied by the box RFID tag
  @bindable({ defaultBindingMode: bindingMode.twoWay }) rows;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) vials;

  bind() {

    this.rows = [];
    var positions: number[] = [];

    // Build up the positions array
    for (var vial of this.vials) {
      if (vial.position) {
        positions.push(vial.position as number)
      }
    }

    // Sort the array first, ascending numbers
    positions.sort(function (a, b) { return a - b });

    // Build up the rows array based on the positions occupied
    var i: number = 0;
    while (i < 10) {
      var row = [];
      var j: number = 0;
      while (j < Resources.boxRowCount) {
        var item: boolean = positions.indexOf((i * Resources.boxColumnCount + j + 1) as number) >= 0;
        row.push(item);
        j++;
      }

      this.rows.push(row);
      i++;
    }
  }
}