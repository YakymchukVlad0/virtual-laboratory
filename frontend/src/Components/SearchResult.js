import "../Styles/SearchResult.css";
import {Modal, Form, FormGroup, FormLabel} from "react-bootstrap";
import { useEffect, useState } from "react";

export const SearchResult = ({ result  }) => {
  const [isTaskInfo, setIsTaskInfo] = useState(false) 
  const handleCloseTaskInfo = ()=>{
    setIsTaskInfo(false)
    console.log(isTaskInfo);
    console.log(result);
  };
  const [selectedTask, setSelectedTask] = useState(null);
  useEffect(()=>{
    const handleTaskSearch = async (taskName)=>{
      console.log(taskName)
      setSelectedTask({
        id : 2,
        name: "Task 1",
        totalTasks: 10,
        code: "for (let i = 0; i < 10; i++) { console.log(i); }",
        completedTasks: 8,
        attempts: 12,
        errors: 3,
        successRate: 80,
        timeSpent: "5 hours",
        deadlines: ["2024-11-01", "2024-11-02", "2024-11-03"],
        programmingLanguage: "Python"
    })
    }

    handleTaskSearch(result);
    console.log(selectedTask);

  },[selectedTask,result])
  
  return (
    <div
      className="search-result"
      onClick={()=>{setIsTaskInfo(!isTaskInfo)}}
    >
      {result}
      <Modal show={isTaskInfo} onHide={handleCloseTaskInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>{result}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                    <FormGroup>
                        
                        <FormLabel>{result}</FormLabel>
                           
                    </FormGroup>

                    </Form>
                </Modal.Body>
            </Modal>
    </div>
  );
};