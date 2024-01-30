import { ChangeEvent, useState } from "react";

export default function AddDynamicInputFields() {
  const [inputs, setInputs] = useState([{ firstName: "", lastName: "" }]);

  const handleAddInput = () => {
    setInputs([...inputs, { firstName: "", lastName: "" }]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    let { name, value } = event.target;
    let onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  };


  return (
    <div className="container">
      {inputs.map((item, index) => (
        <div className="input_container" key={index}>
          <input
            className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            name="firstName"
            type="text"
            value={item.firstName}
            onChange={(event) => handleChange(event, index)}
          />
          <input
            className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            name="lastName"
            type="text"
            value={item.lastName}
            onChange={(event) => handleChange(event, index)}
          />
          {inputs.length > 1 && (
            <button onClick={() => handleDeleteInput(index)}>Delete</button>
          )}
          {index === inputs.length - 1 && (
            <button onClick={() => handleAddInput()}>Add</button>
          )}
        </div>
      ))}

      <div className="body"> {JSON.stringify(inputs)} </div>
    </div>
  );
}