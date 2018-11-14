import gql from 'graphql-tag';


export const gqlSearchQuery = gql`
    query search($searchTerm: String!) {
        search(searchTerm: $searchTerm) {
            Title
    		imdbID
    		Poster
        }
    }
`;



export const gqlGetScreenPlayQuery = gql`
    query getScreenPlay($id: String!) {
        screenplay(id: $id) {
            imdbID
            Title
            Year
            RuntimeMinutes
            Poster
            Type
        }
    }
`;
