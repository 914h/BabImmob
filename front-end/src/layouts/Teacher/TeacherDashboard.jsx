import { useUserContext } from "../../context/StudentContext"
export default function TeacherDashboard(){

    
    const {user} = useUserContext()
    return <>
<div className="relative overflow-x-auto w-full max-w-full p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg">
  <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">ID</th>
        <th scope="col" className="px-6 py-3">Name</th>
        <th scope="col" className="px-6 py-3">Email</th>
        <th scope="col" className="px-6 py-3">Birthdate</th>
        <th scope="col" className="px-6 py-3">Phone</th>
        <th scope="col" className="px-6 py-3">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {user.id}
        </th>
        <td className="px-6 py-4">{user.prenom} {user.nom}</td>
        <td className="px-6 py-4">{user.email}</td>
        <td className="px-6 py-4">{user.birthdate}</td>
        <td className="px-6 py-4">{user.phone}</td>
        <td className="px-6 py-4">{user.created_at}</td>
      </tr>
    </tbody>
  </table>
</div>    </>
}
