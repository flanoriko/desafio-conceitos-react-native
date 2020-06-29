import React, { useEffect, useState } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', { title: `Repositorio numero:${Date.now()}`, url: `www.${Date.now()}.com` });
    const repo = response.data;
    setRepositories([...repositories, repo]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const repository_liked = response.data;

    /*const idxRepo = repositories.findIndex(repository => repository.id === id);
    repositories[idxRepo] = response.data;*/

    const repoUpd = repositories.map(repo => {
      if (repo.id === id) {
        return repository_liked;
      }
      else {
        return repo;
      }
    });
    setRepositories(repoUpd);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => (
            (<View style={styles.repositoryContainer}  >
              <Text style={styles.repository}>{repo.title}</Text>
              <View style={styles.techsContainer}>
                {((repo.techs) ?
                  repo.techs.map((tech, i) =>
                    (
                      <Text style={styles.tech} key={i}>
                        {tech}
                      </Text>
                    )
                  ) : console.log("vazio"))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  
                  testID={`repository-likes-${repo.id}`}>
                    {console.log("aqui->" + repo.id + " "+ repo.likes)}
                    
                  {((repo.likes > 1) ? repo.likes + " curtidas" : repo.likes + " curtida")}

                </Text>
              </View>
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repo.id)}
                  //onPressIn={() => handleLikeRepository(repo.id)}  //funciona na tela

                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repo.id}`}
                //testID={`like-button-1`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </>

            </View>
            )
          )}
        >
        </FlatList>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,

  },
});
