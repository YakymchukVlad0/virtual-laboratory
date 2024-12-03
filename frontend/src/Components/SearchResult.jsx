import "../Styles/SearchResult.css";
import { Modal, Form, FormGroup, FormLabel } from "react-bootstrap";
import { useState } from "react";

export const SearchResult = ({ result, tasks }) => {
  const [isTaskInfo, setIsTaskInfo] = useState(false);

  const handleCloseTaskInfo = () => {
    setIsTaskInfo(false);
  };
  console.log(tasks);

  const findTask = (taskName) => {
    return tasks.find((task) => task.TaskName === taskName) || {};
  };

  const selectedTask = findTask(result);

  return (
    <div
      className="search-result"
      onClick={() => {
        setIsTaskInfo(!isTaskInfo);
      }}
    >
      {result}
      <Modal
        show={isTaskInfo}
        onHide={handleCloseTaskInfo}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedTask.TaskName || "Task Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-info">
            {Object.entries(selectedTask).map(([key, value]) => (
              <FormGroup key={key}>
                <FormLabel>{key.replace(/([A-Z])/g, " $1")}:</FormLabel>
                <p>{value || "N/A"}</p>
              </FormGroup>
            ))}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
