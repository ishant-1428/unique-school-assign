import React, { useEffect, useState } from "react";
import styles from "./TabularData.module.css";
import CryptoJS from "crypto-js";
import { useUserContext } from "../UserContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const TabularData = () => {
  const { subscribers, setSubscribers } = useUserContext();

  const maskData = (value, isEmail = "hexCode") => {
    if (value === null) return;
    if (isEmail === "email") {
      const [username, domain] = value.split("@");
      const maskedUsername = `${username.slice(0, 3)}***`;
      return `${maskedUsername}@${domain}`;
    } else {
      const initialHexCode = value.slice(0, 4);
      const endHexCode = value.slice(-3);
      return `${initialHexCode}...${endHexCode}`;
    }
  };

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";

        line += array[i][index];
      }

      str += line + "\r\n";
    }

    return str;
  };

  const downloadCSV = (jsonData) => {
    const csvStr = convertToCSV(jsonData);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (index) => {
    // Validate index
    if (index >= 0 && index < subscribers.length) {
      const newData = [...subscribers];
      newData.splice(index, 1);
      setSubscribers(newData);

      // Encrypt and save data to local storage
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(newData),
        "secret-key"
      ).toString();
      localStorage.setItem("subscribers", encryptedData);
    }
  };

  const handleEdit = (index, editedName, editedEmail) => {
    if (editedName !== null || editedEmail !== null) {
      // Validate index
      if (index >= 0 && index < subscribers.length) {
        const newData = [...subscribers];
        newData[index].name = editedName;
        newData[index].email = editedEmail;
        setSubscribers(newData);

        // Encrypt and save data to local storage
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(newData),
          "secret-key"
        ).toString();
        localStorage.setItem("subscribers", encryptedData);
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(subscribers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    console.log(items, "items");
    // Update your subscribers state here
    setSubscribers(items);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.coloredLetter}>{subscribers.length}</span>{" "}
        Joinee's
      </h1>
      <div>
        <button onClick={() => downloadCSV(subscribers)}>Download CSV</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.table}
            >
              <tbody className={styles.tableItems}>
                {subscribers.map((row, index) => (
                  <Draggable
                    key={row.hexCode}
                    draggableId={row.hexCode}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={
                          index % 2 === 0 ? styles.evenRow : styles.oddRow
                        }
                      >
                        <td className={styles.tableItem}>
                          #{index + 1} {row.name} {maskData(row.hexCode)}
                          <span className={styles.email}>
                            {maskData(row.email, "email")}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(index)}>
                            Delete
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleEdit(
                                index,
                                prompt("Enter new name"),
                                prompt("Enter new email")
                              )
                            }
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  // return (
  //   <div className={styles.container}>
  //     <h1 className={styles.title}>
  //       <span className={styles.coloredLetter}>{subscribers.length}</span>{" "}
  //       Joinee's
  //     </h1>
  //     <div>
  //       <button
  //         onClick={() => {
  //           downloadCSV(subscribers);
  //         }}
  //       >
  //         Download CSV
  //       </button>
  //     </div>
  //     <div className={styles.table}>
  //       <table>
  //         <tbody className={styles.tableItems}>
  //           {subscribers.map((row, index) => (
  //             <tr
  //               key={index}
  //               className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
  //             >
  //               <td className={styles.tableItem}>
  //                 #{index + 1} {row["name"]} {maskData(row.hexCode)}{" "}
  //                 <span className={styles.email}>
  //                   {maskData(row.email, "email")}
  //                 </span>
  //               </td>
  //               <td>
  //                 <button
  //                   onClick={() => {
  //                     handleDelete(index);
  //                   }}
  //                 ></button>
  //               </td>
  //               <td>
  //                 <button
  //                   onClick={() => {
  //                     handleEdit(
  //                       index,
  //                       prompt("Enter new name"),
  //                       prompt("Enter new email")
  //                     );
  //                   }}
  //                 >
  //                   Edit
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
};
