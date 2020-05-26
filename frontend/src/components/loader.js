import React from "react";
import Loader from 'react-loader-spinner';


class DefaultLoader extends React.Component{
    render() {
        return <div style={{
            textAlign: 'center'
        }}>
            <Loader
                type="Audio"
                color="#1890FF"
                height={60}
                width={60}
            />
            <b>Ładowanie...</b>
        </div>
    }
}

export default DefaultLoader;
