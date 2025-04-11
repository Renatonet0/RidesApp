import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
import { router } from 'expo-router';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.rfan.rides',
    projectId: '6729357f00331bb97a5d',
    databaseId: '672936f0001d92b2a198',
    userCollectionId: '672b91760039f40fcacb',
    ridesCollectionId: '672a3719002918446e28',
    storageId: '672938a20020dcfa48d1',
    avatarBucketId: '672938a20020dcfa48d1'
}

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client)

export const createUser = async (email, password, username, birthdate) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)
    await signin(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
        birthdate,
        carBrand: '',
        description: '',
        car: false,
        rating: 0,
        listRating: [],
        tripsP: 0,
        tripsD: 0,
        nRating: 0,
      }
    )

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export const signin = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const userDocuments = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (userDocuments.documents.length === 0) {
      throw new Error("Documento do usuário não encontrado.");
    }

    return userDocuments.documents[0]
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getUser = async (userId) => {
  if (!userId) return;
  try {
    const userDocuments = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', userId)]
    )

    if (userDocuments.documents.length === 0) {
      throw new Error("Documento do usuário não encontrado.");
    }

    return userDocuments.documents[0]
  } catch (error) {
    console.log(error);
    return null;
  
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export const deleteAccount = async () => {
  try {
    const currentAccount = await account.get(); 

    if (!currentAccount) throw new Error("Usuário não encontrado");

    const user = await getCurrentUser();
    if (!user) throw new Error("Dados do usuário não encontrados.");

    const userRides = await getUserRides(user.$id);

    for (let ride of userRides) {
      await deleteRide(ride.$id);
    }

    const userDocuments = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocId = userDocuments.documents[0].$id;
      await databases.deleteDocument(config.databaseId, config.userCollectionId, userDocId);
    }

    await getAccount().deleteAccount();

    router.dismissAll();
    router.replace("../app/(auth)/signIn");
  } catch (error) {
    console.log("Erro ao deletar a conta:", error);
    throw new Error("Falha ao deletar a conta.");
  }
};

export const getAllRides = async () => {
  try {
    const rides = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId
    )
    return rides.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getRidesDePara = async (de, para) => {
  try {
    const rides = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId
    )

    if (!de && !para) {
      return rides.documents; // Retorna todas as viagens
    }

    const filteredRides = rides.documents.filter(ride => {
      const deMatch = de ? ride.de.toLowerCase().includes(de.toLowerCase()) : true;
      const paraMatch = para ? ride.para.toLowerCase().includes(para.toLowerCase()) : true;
      return deMatch && paraMatch;
    });

    return filteredRides;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserRides = async (userId, uId) => {
  if (!userId) return;

  try {
    const creatorRides = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('creator', userId)]
    );

    const passengerRides = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('passengersId', [uId])]
    );

    const allRides = [
      ...creatorRides.documents,
      ...passengerRides.documents
    ].filter((ride, index, self) =>
      index === self.findIndex((r) => r.$id === ride.$id) 
    );

    return allRides;
  } catch (error) {
    throw new Error(`Error fetching rides: ${error.message}`);
  }
};

export const updateUserProfile = async ({ username, birthdate, avatar, carBrand, description, car }) => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error;

    const userDocument = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    const userDocId = userDocument.documents[0].$id;

    const dataToUpdate = {};
    if (username && username.trim() !== "") dataToUpdate.username = username;
    dataToUpdate.birthdate = birthdate;
    if (avatar && avatar.trim() !== "") dataToUpdate.avatar = avatar;
    if (carBrand && carBrand.trim() !== "") dataToUpdate.carBrand = carBrand;
    if (description && description.trim() !== "") dataToUpdate.description = description;
    dataToUpdate.car = car;

    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userDocId,
      dataToUpdate
    );

    return updatedUser;
  } catch (error) {
    console.log("Erro ao atualizar o perfil do usuário:", error);
    throw new Error("Falha ao atualizar o perfil do usuário.");
  }
};




export const createRide = async ({de, para, data, pessoas}) => {
  const currentAccount = await account.get();
  const user = await getCurrentUser();

  if (!currentAccount) throw new Error;
  if (!user) throw new Error("Dados do usuário não encontrados.");

  try {
    const newRide = await databases.createDocument(
      config.databaseId,
      config.ridesCollectionId,
      'unique()', 
      {
        de: de,
        para: para,
        data: data,
        pessoas: parseInt(pessoas, 10),
        ocupado: 0,
        creator: user.$id,
        rideId: 'temporary',
        passengersId: [],
        messages: [],
      });
      await databases.updateDocument(config.databaseId, config.ridesCollectionId, newRide.$id, {
        rideId: newRide.$id,
      });
      
    return newRide;
    } catch (error) {
      throw new Error(error);
    }
};

export const deleteRide = async(rideId) => {
  try {
    await databases.deleteDocument(
      config.databaseId,
      config.ridesCollectionId,
      rideId
    );

    return true;
  } catch (error) {
    throw new Error("Failed to delete the ride.");
  }
};

export const getRide = async(rideId) => {
  try {
    const rides = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    )
    return rides.documents[0];
  } catch (error) {
    throw new Error(error);
  }
}




export const putMessage = async(rideId, message) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const rideDocument = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    );

    if (rideDocument.documents.length === 0) {
      throw new Error("Ride not found");
    }

    const ride = rideDocument.documents[0];

    await databases.updateDocument(
      config.databaseId,
      config.ridesCollectionId,
      ride.$id,
      {
        messages: [...ride.messages, message],
      }
    );
    console.log("Message send sucessfuly");
  } catch (error) {
    console.error("Failed to add passenger:", error);
  }
};

export const getMessages = async (rideId) => {
  try {

    const rideDocument = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    );

    if (rideDocument.documents.length === 0) {
      throw new Error("Ride not found");
    }

    const ride = rideDocument.documents[0];

    return ride?.messages
  } catch (error) {
    console.error("Failed to get messages", error);
  }
};




export const addPassanger = async (rideId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const rideDocument = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    );

    if (rideDocument.documents.length === 0) {
      throw new Error("Ride not found");
    }

    const ride = rideDocument.documents[0];

    if (ride.passengersId.includes(user?.accountId)) {
      console.log("User is already a passenger");
      return;
    }

    await databases.updateDocument(
      config.databaseId,
      config.ridesCollectionId,
      ride.$id,
      {
        passengersId: [...ride.passengersId, user?.accountId],
        ocupado: ride?.ocupado + 1
      }
    );

    console.log("Passenger added successfully");
  } catch (error) {
    console.error("Failed to add passenger:", error);
  }
};

export const removePassanger = async(rideId, userId) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const rideDocument = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    );

    if (rideDocument.documents.length === 0) {
      throw new Error("Ride not found");
    }

    const ride = rideDocument.documents[0];

    await databases.updateDocument(
      config.databaseId,
      config.ridesCollectionId,
      ride.$id,
      {
        passengersId: ride.passengersId.filter(id => id !== userId),
        ocupado: ride?.ocupado - 1
      }
    );

    console.log("Passenger removed successfully");
  } catch (error) {
    console.error("Failed to add passenger:", error);
  }
};

export const getPassengers = async (rideId) => {
  try {

    const rideDocument = await databases.listDocuments(
      config.databaseId,
      config.ridesCollectionId,
      [Query.equal('rideId', rideId)]
    );

    if (rideDocument.documents.length === 0) {
      throw new Error("Ride not found");
    }

    const ride = rideDocument.documents[0];

    return ride?.passengersId
  } catch (error) {
    console.error("Failed to get messages", error);
  }
};




export const sendRating = async (userId, rate) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    console.log(typeof userId, userId);
    const response = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', userId)]
    );

    if (response.documents.length === 0) {
      throw new Error("Driver not found");
    }

    const driver = response.documents[0];
    let newNumberRating = 0;
    let newRating = 0;

    for (let i=0; i<driver.listRating.length; i++) {
      const [id,_] = driver.listRating[i].split(":")
      if (id === user?.accountId) {
        driver.listRating[i] = `${id}:${rate}`
      }
      newNumberRating += 1;
      newRating += parseInt(driver.listRating[i].split(":")[1], 10);;
    }

    if (!driver.listRating.some(item => item.split(":")[0] === user?.accountId)) {
      driver.listRating.push(`${user?.accountId}:${rate}`);
      newNumberRating += 1;
      newRating += rate;
    }
    const novaMedia = newRating / newNumberRating;

    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      driver.$id,
      {
        nRating: newNumberRating,
        listRating: driver.listRating,
        rating: novaMedia,
      }
    );

    console.log("Rating added successfully");
  } catch (error) {
    console.error("Failed to add rating:", error);
  }
};



export { account };