import React, { useState } from 'react'

function EditDate({prevMonth, prevYear , editDateSubmitHandler}) {
    const [monthInput, setMonthInput] = useState({
        month: prevMonth || "Jan",
        year: prevYear || "22",
      });
    function monthInputHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setMonthInput((prev) => ({ ...prev, [name]: value }));
      }
    return (
        <div>
            <h4>Edit Month and Year:</h4>
            <div>
        <span>
          <label htmlFor="month">Month:</label>
          <select
            value={monthInput.month}
            onChange={monthInputHandler}
            id="month"
            name="month"
          >
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
            <option>Jul</option>
            <option>Aug</option>
            <option>Sep</option>
            <option>Oct</option>
            <option>Nov</option>
            <option>Dec</option>
          </select>
        </span>
        <span>
          <label htmlFor="year">Year:</label>
          <select
            value={monthInput.year}
            onChange={monthInputHandler}
            id="year"
            name="year"
          >
            <option>22</option>
            <option>21</option>
            <option>20</option>
            <option>19</option>
            <option>18</option>
            <option>17</option>
            <option>16</option>
            <option>15</option>
          </select>
        </span>
        <div>
            <button onClick={() => {
                editDateSubmitHandler(monthInput)
            }}>Submit</button>
        </div>
      </div>
        </div>
  )
}

export default EditDate