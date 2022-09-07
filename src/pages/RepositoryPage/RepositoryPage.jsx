import { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { repoStoreAtom } from '@/state'

import { useRepoService } from '@services/useRepoService'

import { useRepositoryTree, useFile } from '@hooks'

import { Heading } from '@components'
import { Modal } from './Modal'
import { FilesTable } from './FilesTable'

export function RepositoryPage() {
    const { repositoryName, setRepositoryName, branchName, setBranchName, currentPath, selectedFile, resetRepoState } =
        useAtomValue(repoStoreAtom)

    const { openFileOrFolder, toFolder, folderUp, toTheRootFolder } = useRepoService()

    const params = useParams()

    useEffect(() => {
        const [name, branch] = params.repository.split('~')

        resetRepoState()
        setRepositoryName(name)
        setBranchName(branch)
    }, [])

    const { repositoryTree, oid } = useRepositoryTree(repositoryName, `${branchName}:${currentPath.join('/')}`)
    const file = useFile(repositoryName, `${branchName}:${selectedFile}`)

    return (
        <Container>
            {repositoryName && <Heading>{repositoryName}</Heading>}
            {repositoryTree.length !== 0 && (
                <FilesTable
                    branchName={branchName}
                    currentPath={currentPath}
                    repositoryTree={repositoryTree}
                    openFileOrFolder={openFileOrFolder}
                    toFolder={toFolder}
                    folderUp={folderUp}
                    toTheRootFolder={toTheRootFolder}
                />
            )}
            {file?.text && <Modal fileContent={file.text} oid={oid} />}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`