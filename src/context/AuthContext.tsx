import { createContext, useState, useContext, useEffect } from 'react'
import { IUser } from '../types/index'
import { getCurrentUser } from '@/lib/appwrite/api';
import { useNavigate } from 'react-router-dom';



export const INITIAL_USER = {
    id: '', 
    name: '', 
    username: '', 
    email: '', 
    imageUrl: '', 
    bio: '', 
}

const INITIAL_STATE = {
    user: INITIAL_USER, // 初期ユーザー情報
    isLoading: false, // 読み込み中かどうか
    isAuthenticated: false, // 認証済みかどうか
    setUser: () => {}, // ユーザー情報を設定する関数
    setIsAuthenticated: () => {}, // 認証状態を設定する関数
    checkAuthUser: async () => false as boolean, // ユーザーの認証状態を確認する関数
}

type IContextType = {
    user: IUser; // ユーザー情報
    isLoading: boolean; // 読み込み中かどうか
    setUser: React.Dispatch<React.SetStateAction<IUser>>; // ユーザー情報を設定する関数
    isAuthenticated: boolean; // 認証済みかどうか
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // 認証状態を設定する関数
    checkAuthUser: () => Promise<boolean>; // ユーザーの認証状態を確認する関数
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] =useState<IUser>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            // 現在のユーザーを取得する
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                // ユーザーが存在する場合は、ユーザー情報をセットして認証状態にする
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                });
                setIsAuthenticated(true);
                return true;
            }
            // ユーザーが存在しない場合は認証状態を解除する
            return false;
        } catch (error) {
            // エラーが発生した場合はエラーメッセージをコンソールに出力する
            console.log(error);
            return false;
        } finally {
            // ローディング状態を解除する
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (
            localStorage.getItem('cookieFallback') === '[]' ||  // ローカルストレージが空の場合
            localStorage.getItem('cookieFallback') === null // ローカルストレージにcookieFallbackがない場合
        ) {
            navigate('/sign-in'); // '/sign-in' ページにリダイレクト
        }
        checkAuthUser(); // 認証済みユーザーをチェックする
    }, []);

    const value = {
        user,
        isLoading,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;

export const useUserContext = () => {
    return useContext(AuthContext);
}



