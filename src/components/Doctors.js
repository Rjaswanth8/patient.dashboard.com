import React, { useState } from "react";
import Doctors from "../components/Doctordata";

import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function Doc() {
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const filteredDoctors = Doctors.filter((item) =>
    `${item.name} ${item.department} ${item.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedDoctors = filteredDoctors.slice(first, first + rows);

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 120, value: 120 },
      ];

      return (
        <>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first + 1} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  return (
    <div className="doc-main">
      <div>
        <h5 className="doc">Doctors</h5>
      </div>

      <div className="search">
        <input
          type="search"
          name="search"
          placeholder="Search"
          id="docsearch"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <h6>
                <strong>Doctor Name</strong>
              </h6>
            </th>
            <th>
              <h6>
                <strong>Department</strong>
              </h6>
            </th>
            <th>
              <h6>
                <strong>Phone</strong>
              </h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedDoctors.map((item) => (
            <tr key={item.phone}>
              <td>{item.name}</td>
              <td>{item.department}</td>
              <td>
                <i className="fi fi-rr-mobile-notch"></i> {item.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container pagination-container pt-4">
        <Paginator
          template={template}
          first={first}
          rows={rows}
          totalRecords={filteredDoctors.length}
          onPageChange={onPageChange}
          className="justify-content-center"
        />
      </div>
    </div>
  );
}

export default Doc;
