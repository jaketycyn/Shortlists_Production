import dynamic from "next/dynamic";

const RegisterForm = dynamic(() => import('../components/Registerform'), {
  ssr: false,
})

function RegisterPage(){
  return (

    <div>
      <RegisterForm/>
    </div>
      )
}
 
export default RegisterPage