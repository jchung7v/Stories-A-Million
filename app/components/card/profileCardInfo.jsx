"use client"
import Image from 'next/image';
import React from 'react';
import {useEffect, useState} from 'react';

const ProfileCardInfo = ({ genre, userId, mainCharacter }) => {
  const [user , setUser] = useState({});
  
  


useEffect(()=> {
  const endpoint = `/api/users/${userId}`

  fetch(endpoint, {
    method:"GET"
  }).then(
    res => res.json()
  ).then(
    ({user}) => {
      setUser(user)            
    }
  )
  })
return (
<div className="rounded-3xl overflow-hidden shadow-xl max-w-xs bg-white mx-auto flex flex-col items-center h-40"
style={{ width:"40%" }}
>
<Image src="https://dummyimage.com/500x200/000/fff"  
    width={500}
    height={200}
    alt='bookCover'
  className="w-full"/>
<div className="flex justify-center -mt-8">
<Image src={user.image} alt={"userImg"} width={300} height={300} className="rounded-full border-solid border-white border-2" />
</div>
  <div className="text-center px-2 pb-2 pt-2">
    <h3 className="text-black text-sm font-bold font-sans">{user.penName}</h3>
  </div>
  <div className="flex justify-center pb-2 text-black">
    <div className="text-center mr-3 border-r ">
      <h2 className="font-bold">Genre</h2>
      <span className="font-bold">{genre}</span>
    </div>
    <div className="text-center">
      <h2 className="font-bold">Main character</h2>
      <span className="font-bold">{mainCharacter} people</span>
    </div>
  </div>
</div>
);
};

export default ProfileCardInfo;

