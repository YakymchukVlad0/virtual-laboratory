<<<<<<< HEAD
import '../Styles/PageContent.css';
=======
import React from "react";
import classes from '../Styles/PageContent.modules.css';
>>>>>>> c2f81cf2fba6fa797ea8c6254bc466ea0dbe312b


function PageContent({ title, children }) {
  return (
    <div className='content'>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default PageContent;