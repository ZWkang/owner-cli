module.exports = {
    fileContent: (folderName) => `
import React from 'react'
import styled from 'styled-components'

class ${folderName} extends React.Component {
    render () {
        return (

        )
    }
}
export default ${folderName}
    `
}