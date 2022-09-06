import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { Button } from './Button'

import { COMMIT } from '../graphql'

export function Modal({ text, closeFile, currentPath, oid }) {
    const [modalContainer] = useState(() => document.createElement('div'))
    const [value, setValue] = useState('')
    const [commitMessage, setCommitMessage] = useState('')

    console.log(oid)

    const [commitChanges, { data }] = useMutation(COMMIT)

    console.log('COMMIT DATA:', data)

    const commitHandler = () => {
        console.log('CLICK HANDLER EXECUTED')
        commitChanges({
            variables: {
                ownerAndRepo: 'bejzik8/documents',
                branchName: 'master',
                message: commitMessage,
                path: 'test.md',
                content: btoa(value),
                oid
            }
        })
    }

    useEffect(() => {
        modalContainer.classList.add('modal-root')
        document.body.appendChild(modalContainer)
        document.body.style.overflow = 'hidden'
        setValue(text)

        return () => {
            document.body.removeChild(modalContainer)
            document.body.style.overflow = 'auto'
        }
    }, [])

    const onChangeHandler = event => {
        setValue(event.target.value)
        console.log('BASE64:', btoa(event.target.value))
    }

    const handleCloseFile = event => {
        if (event.target === event.currentTarget) closeFile()
    }

    return createPortal(
        <Backdrop onClick={handleCloseFile}>
            <Container>
                <Title>markdown-editor.md</Title>
                <MarkdownModal>
                    <Textarea spellCheck={false} value={value} onChange={onChangeHandler} />
                </MarkdownModal>
                <Footer>
                    <Input
                        placeholder='Commit message...'
                        value={commitMessage}
                        onChange={e => setCommitMessage(e.target.value)}
                    />
                    <Button onClick={commitHandler}>Commit Changes</Button>
                </Footer>
            </Container>
        </Backdrop>,
        modalContainer
    )
}

const Container = styled.div`
    min-height: 500px;
    width: 100%;
    max-width: 768px;
`

const Title = styled.h1`
    line-height: 28px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0 20px;
    margin: 0 0 16px;
`

const MarkdownModal = styled.div`
    min-height: 500px;
    height: 60vh;
    width: calc(100% - 40px);
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    padding: 20px;
`

const Backdrop = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.9);
`

const Textarea = styled.textarea`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    color: rgba(255, 255, 255, 0.9);
    background-color: transparent;
    line-height: 20px;
    font-family: JetBrainsMono;
    font-size: 14px;
    outline: none;
    resize: none;
`

const Footer = styled.div`
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    margin-top: 16px;
`

const Input = styled.input`
    height: 28px;
    flex: 1;
    box-sizing: border-box;
    border-radius: 6px;
    border: none;
    line-height: 20px;
    font-family: JetBrainsMono;
    font-size: 14px;
    outline: none;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 4px 20px;
    margin-right: 15px;
`
