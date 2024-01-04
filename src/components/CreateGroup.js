import { supabase } from "../functions/SupabaseClient";
import "../styles/creategroup.css";

import { useState } from "react";

export default function CreateGroup(props) {
  const [users, setUsers] = useState(["",""]);
  const [errors, setErrors] = useState([false, false]);
  const [name, setName] = useState("");

  const addUser = () => {
    setUsers([...users, ""]);
    setErrors([...errors, false]);
  };

  const handleUserChange = (index, value) => {
    let shallow = [...users];
    shallow[index] = value;
    setUsers(shallow);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const remove = (index) => {
    let userCopy = [...users];
    let errCopy = [...errors];
    if (userCopy.length>2) {
      userCopy.splice(index, 1);
      errCopy.splice(index, 1);
      setUsers([...userCopy]);
      setErrors([...errCopy]);
    }

  };

  const validate = async (entry) => {
    const {data, error} = await supabase.from("users").select("userID").or(`username.eq.${entry},email.eq.${entry}`);
    console.log(data?data:error)
    if (data)
      return !data.length>0
    return true;
  };

  const validateAll = async () => {
    const truths = await Promise.all(users.map(validate));
    console.log(users)
    console.log(truths);
    setErrors(truths);
    return truths.some((element) => element);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateAll())) {
      console.log(users);
      setUsers(["",""]);
    }
  };

  return (
    <div className="create-group">
      <div className="creategroup-header"><h3>Create Group</h3><br/></div>
      <form onSubmit={handleSubmit}>
        <table>
          <thead             
            style={{fontSize: "20px", alignItems: "center"}}
          >
            <span>Enter Group Name{" "}</span>
            <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e)}
            required
            style={{fontSize:"inherit", width: "59%"}}
            >
            </input>
          </thead>
          <tbody>
            <p className="add0">*Add user emails or usernames to the list.*</p>
            {users.map((user, index) => (
              <div key={index}>
                <tr key={index}>
                  <td style={{position:"relative"}}>Email or username{errors[index]?<div className="error table-message">User doesn't exist</div>:<div className="error table-message"/>}</td>
                  <td>
                    <input
                      type="text"
                      value={user}
                      onChange={(e) => handleUserChange(index, e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <button className="remove" onClick={() => remove(index)}>
                      <img src="remove.png" />
                    </button>
                  </td>
                </tr>
              </div>
            ))}
          </tbody>
        </table>
        <div className="btn-ctnr">
          <button className="add-user-button" onClick={() => addUser()}>
            Add User
          </button>
          <button className="create-group-button" type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
  //make sure to call validate on each email
}
