
import UserRequest from "../domain/DTOS/UserRequest";
import IUser from "../domain/User";
import UserRepository from "../domain/UserRepository";
import UserModel from "../../shared/ModelUser";

export default class UserMongoRepository implements UserRepository {

    constructor(readonly model: typeof UserModel) { }

   async addUser(userReques: UserRequest): Promise<IUser | null> {
        try {

            const isExistedUser = await this.findUser(userReques.name, userReques.email);
            if(isExistedUser) return null;            

            const result = await this.model.create({
                name: userReques.name,
                email: userReques.email,
                password: userReques.password,
                rol: userReques.rol
            });

            return {
                id: result.id,
                name: result.name,
                email: result.email,
                password: result.password,
                rol: result.rol
            }

        } catch (error) {
            console.error('Error trying to add user to database:', error);
            throw new Error('Error accessing database');
        }
    }

    async getUserByPk(pk: string): Promise<IUser | null> {

        try {
            const result: IUser | null = await this.model.findById(pk)
            return result

        } catch (error) {
            console.error('Error trying to search for user in database:', error);
            throw new Error('Error accessing database');
        }
    }


    async getUsers(): Promise<IUser[] | null> {

        try {
            const result: IUser[] = await this.model.find();

            return result

        } catch (error) {
            console.error('Error trying to search for users in database:', error);
            throw new Error('Error accessing database');
        }
    }

    async findUser(name: string, email: string): Promise<IUser | null> {
        try {

            const userFound = await this.model.findOne({ name, email });
            if (!userFound) return null;

            return {
                id: userFound.id,
                name: userFound.name,
                email: userFound.email,
                password: userFound.password,
                rol: userFound.rol
            };

        } catch (error) {
            console.error('Error trying to search for user in database:', error);
            throw new Error('Error accessing database');
        }
    }

}