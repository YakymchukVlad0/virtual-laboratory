import { render, screen } from "@testing-library/react";
import TableFormat from "../Components/TableFormat.jsx";
import { taskData } from "../FakeData/Data";

describe("TableFormat Component", () => {
  it("displays the correct number of rows based on the data array", () => {
    
    render(<TableFormat dataArray={taskData} />);

    const dataTable = screen.getByTestId("dataTable");

    
    const rows = dataTable.querySelectorAll(".MuiDataGrid-row");
    expect(rows.length).toBe(5);
  });

  it("displays the correct data for the first data row", () => {
    render(<TableFormat dataArray={taskData} />);

    const dataRows = screen.getAllByRole("row").filter(
      (row) => row.getAttribute("data-id") 
    );


    const firstRow = dataRows[0];

    expect(firstRow).toHaveTextContent(taskData[0].id.toString());
  });
});

