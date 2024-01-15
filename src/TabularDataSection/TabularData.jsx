import React, { useEffect, useState } from "react";
import styles from "./TabularData.module.css";
import CryptoJS from "crypto-js";
import { useUserContext } from "../UserContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const TabularData = () => {
  // Access subscribers and setSubscribers from the context
  const { subscribers, setSubscribers } = useUserContext();

  // Mask email and hexCode for privacy
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

  // Convert array to CSV format
  const convertToCSV = (objArray) => {
    const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
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

  // Download CSV file
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

  // Delete subscriber by index
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

  // Edit subscriber by index
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

  // Handle drag-and-drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(subscribers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update subscribers state with the new order
    setSubscribers(items);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.coloredLetter}>{subscribers.length}</span>{" "}
        Joinee's
      </h1>
      {subscribers.length > 0 && (
        <div>
          {/* Download CSV button */}
          <button
            className={styles.downloadCSV}
            onClick={() => downloadCSV(subscribers)}
          >
            Download CSV
          </button>
        </div>
      )}

      {/* Drag and drop context */}
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="droppable" className={styles.droppable}>
          {(provided) => (
            // Table with drag-and-drop capabilities
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.table}
            >
              <tbody className={styles.tableItems}>
                {/* Mapping through subscribers to render rows */}
                {subscribers.map((row, index) => (
                  // Draggable row
                  <Draggable
                    key={row.hexCode}
                    draggableId={row.hexCode}
                    index={index}
                  >
                    {(provided) => (
                      // Table row
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={
                          index % 2 === 0 ? styles.evenRow : styles.oddRow
                        }
                      >
                        {/* Table data cells */}
                        <td className={styles.tableItem}>
                          <span className={styles.tableItems}>
                            #{index + 1}
                          </span>
                          <span className={styles.name}>{row.name}</span>{" "}
                          <span className={styles.name}>
                            {maskData(row.hexCode)}
                          </span>
                          <span className={styles.email}>
                            {maskData(row.email, "email")}
                          </span>
                        </td>
                        <td>
                          <button
                          className={styles.buttons}
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
                        <td>
                          <button onClick={() => handleDelete(index)} className={styles.buttons}>
                            Delete
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
};