import { useState } from 'react'
import styled from 'styled-components'

import { useRepositories, useRepositoryTree } from '../hooks'

import { Heading, Pre } from '../components'

const RepoItem = ({ name, url, createdAt, updatedAt, onClick }) => {
    return (
        <RepoItemContainer onClick={onClick}>
            <Paragraph bold marginBottom>
                {name}
            </Paragraph>
            <Paragraph>{url}</Paragraph>
            <Paragraph>Created: {new Date(createdAt).toLocaleDateString()}</Paragraph>
            <Paragraph>Updated: {new Date(updatedAt).toLocaleDateString()}</Paragraph>
        </RepoItemContainer>
    )
}

export const GraphQLPage = () => {
    const [selectedRepo, setSelectedRepo] = useState(null)

    const userAndRepositoriesData = useRepositories()
    const repositoryTree = useRepositoryTree(
        userAndRepositoriesData?.user?.login,
        selectedRepo?.name,
        `${selectedRepo?.defaultBranchRefName}:`
    )

    console.log('REPOSITORIES:', userAndRepositoriesData)
    console.log('REPOSITORY TREE:', repositoryTree)

    const selectRepo = repo => setSelectedRepo(repo)

    return (
        <Container>
            <UserInfoContainer>
                <PageName>GraphQL Page</PageName>
                {userAndRepositoriesData?.user && (
                    <UserData>
                        <UserInfo>
                            <Paragraph bold marginBottom>
                                {userAndRepositoriesData.user.name}
                            </Paragraph>
                            <Paragraph>{userAndRepositoriesData.user.bio}</Paragraph>
                        </UserInfo>
                        <UserImage src={userAndRepositoriesData.user.avatarUrl} />
                    </UserData>
                )}
            </UserInfoContainer>
            {selectedRepo ? (
                <>
                    <Heading>Selected Repo</Heading>
                    <RepoItem
                        key={selectedRepo.id}
                        name={selectedRepo.name}
                        url={selectedRepo.url}
                        createdAt={selectedRepo.createdAt}
                        updatedAt={selectedRepo.updatedAt}
                    />
                </>
            ) : userAndRepositoriesData ? (
                <>
                    <Heading>userAndRepositoriesData</Heading>
                    <RepoContainer>
                        {userAndRepositoriesData?.repositories?.map(repo => (
                            <RepoItem
                                key={repo.id}
                                name={repo.name}
                                url={repo.url}
                                createdAt={repo.createdAt}
                                updatedAt={repo.updatedAt}
                                onClick={selectRepo.bind(null, repo)}
                                // onClick={() => console.log(repo)}
                            />
                        ))}
                    </RepoContainer>
                    <Pre>{JSON.stringify(userAndRepositoriesData, null, 2)}</Pre>
                </>
            ) : (
                <p>Fetching...</p>
            )}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

const UserInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
`

const PageName = styled.h1`
    display: inline-block;
    margin: 0;
`

const UserData = styled.div`
    padding: 10px;
    border: 1px solid #d0d7de;
    border-radius: 5px;
`

const UserInfo = styled.div`
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
`

const Paragraph = styled.p`
    line-height: 16px;
    font-size: 12px;
    margin: 0;

    ${({ bold }) => bold && 'font-weight: 800;'}
    ${({ marginBottom }) => marginBottom && 'margin-bottom: 8px;'}
`

const UserImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`

const RepoContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const RepoItemContainer = styled.div`
    display: inline-block;
    vertical-align: top;
    width: 20%;
    padding: 20px;
    border: 1px solid #d0d7de;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-bottom: 20px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`
