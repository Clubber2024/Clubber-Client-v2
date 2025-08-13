import { getAccessToken } from "@/auth/AuthService"
import { apiClient } from "@/lib/apiClient"

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const token = getAccessToken();
  if(!token){
    throw new Error('Token not found')
  }
  try {
    const res = await apiClient.patch('/v1/admins/me/password', {
      oldPassword:oldPassword,
      newPassword:newPassword
    },{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if(res.data.success){
      console.log(res.data)
      return res.data
    } else {
      throw new Error('Password change failed')
    }
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.reason) {
      throw new Error(error.response.data.reason)
    } else if (error.response?.status === 400) {
      throw new Error('Invalid request')
    } else {
      throw new Error('Password change failed')
    }
  }
}