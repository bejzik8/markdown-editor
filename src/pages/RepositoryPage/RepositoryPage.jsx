import { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { repoStoreAtom } from '@/state'

import { useRepositoryService } from '@services'

import { useRepositoryTree } from '@hooks'

import { Heading } from '@components'
import { Modal } from './Modal'
import { FilesTable } from './FilesTable'

export function RepositoryPage() {
    const { repositoryName, setRepositoryName, branchName, setBranchName, currentPath, selectedFile, resetRepoState } =
        useAtomValue(repoStoreAtom)

    const { openFileOrFolder, toFolder, folderUp, toTheRootFolder } = useRepositoryService()

    const params = useParams()

    useEffect(() => {
        const [name, branch] = params.repository.split('~')

        resetRepoState()
        setRepositoryName(name)
        setBranchName(branch)
    }, [])

    const { repositoryTree, loading } = useRepositoryTree(repositoryName, `${branchName}:${currentPath.join('/')}`)

    return (
        <Container>
            <Heading>{repositoryName}</Heading>
            <FilesTable
                branchName={branchName}
                currentPath={currentPath}
                repositoryTree={repositoryTree}
                openFileOrFolder={openFileOrFolder}
                toFolder={toFolder}
                folderUp={folderUp}
                toTheRootFolder={toTheRootFolder}
                loading={loading}
            />
            {selectedFile && <Modal />}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
