import React from "react";
import PageContent from "../Components/PageContent.jsx";
import { useRouteError } from "react-router-dom";
const ErrorPage = () => {
    const error = useRouteError();
    let title = 'Error occured';
    let message = 'Something went wrong';
    if(error.status===500){
        message = JSON.parse(error.data).message;
    }

    if(error.status===404){
        title = 'Not found';
        message = 'Bad route';
    }
    return ( 
        <PageContent title={title}>
            <p>{message}</p>    
        </PageContent>
     );
}
 
export default ErrorPage;