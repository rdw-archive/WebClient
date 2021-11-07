class Table extends Widget {
	constructor(widgetName, parentFrame, template) {
		super(widgetName, parentFrame, template);

		this._obj = document.createElement("table");
		this.headerRow = document.createElement("tr");
		this._obj.appendChild(this.headerRow);

		this.headers = [];
		this.cells = [];

		this.setParent(parentFrame);
		this.parentFrame = parentFrame;
	}
	setHeader(column, content) {
		this.headers[column] = content;
		this.update();
	}
	setCell(row, column, content) {
		this.cells[row] = this.cells[row] || [];
		this.cells[row][column] = content;
		this.update();
	}
	update() {
		this.reset();
		this.updateHeader();
		this.updateCells();
	}
	reset() {
		// Hacky AF...
		this._obj.remove(); // Also removes all children
		this._obj = document.createElement("table");

		this.setParent(this.parentFrame);

		this.headerRow = document.createElement("tr"); // Kinda wasteful, but eh
		this._obj.appendChild(this.headerRow);

		this.tbody = document.createElement("tbody");
		this._obj.appendChild(this.tbody);
	}
	resetCells() {
		this.cells = [];
	}
	updateHeader() {
		for(let content of this.headers) {
			content = content || ""; // Just to skip over any holes there may be

			const th = document.createElement("th");

			th.innerText = content;
			th.className = "GameFontNormal";

			this.headerRow.appendChild(th);
		}
	}
	updateCells() {
		for(const row in this.cells) {
			const tr = document.createElement("tr");

			if(row === this.selectedRowID) tr.classList.add("SelectedTableRow");

			tr.onclick = () => {
				DEBUG(format("Row %s was clicked", row));
				this.selectedRowID = row;
				this.update();

				this.onRowClicked();
			};

			for(const content of this.cells[row]) {
				const td = document.createElement("td");

				td.innerText = content;
				td.className = "GameFontNormal";


				tr.appendChild(td);
			}
			this.tbody.appendChild(tr);
		}
	}
	getSelectedRow() {
		return this.selectedRowID;
	}
	onRowClicked() {
		// Overwrite with custom handler if needed
	}

}
