import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../services/configuration/configuration.service';

@Component({
  selector: 'app-point-value-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './point-value-selector.component.html',
  styleUrl: './point-value-selector.component.scss'
})
export class PointValueSelectorComponent {

  selectedPointValues: number[] = [0, 1, 2, 3, 4];
  pointValues: number[] = [0, 1, 2, 3, 4];
  dropdownVisible = true;

  constructor(private configurationService: ConfigurationService){}

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onPointValueToggle(pointValue: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    if (isChecked) {
      this.selectedPointValues.push(pointValue);
    } else {
      this.selectedPointValues = this.selectedPointValues.filter(pV => pV !== pointValue);
    }
    this.selectedPointValues.sort();
    this.configurationService.setPointValueList(this.selectedPointValues)
  }

  isSelected(pointValue: number): boolean {
    return this.selectedPointValues.some(pV => pV === pointValue);
  }

}
