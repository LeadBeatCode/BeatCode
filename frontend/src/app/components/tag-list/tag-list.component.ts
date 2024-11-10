import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnChanges {
  @Input() tagsMap: Map<string, number> = new Map();
  tagEntries: { key: string, value: number }[] = [];

  ngOnChanges() {
    this.tagEntries = Array.from(this.tagsMap.entries()).map(([key, value]) => ({ key, value }));
  }
}