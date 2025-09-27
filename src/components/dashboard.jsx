"use client";

import { Eye, Users, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d_div"

export default function AetherDashboard() {
  const router = useRouter();
  const handleModuleClick = (module) => {
    console.log("Clicked:", module);
  };
  const handlemousenter = () => {

    router.push('/Cupola')
  }
    const handlemousenter2 = () => {

    router.push('/models')
  }
  return (
    <div className="relative z-10 flex flex-col container mx-auto px-3 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <div className="w-6 h-6 rounded-full bg-gray-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            AETHER: THE LEO EXPERIENCE
          </h1>
        </div>
        <p className="text-gray-400 text-md max-w-2xl mx-auto">
          Experience life and work aboard the International Space Station
          through immersive training simulations and Earth observation missions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl backdrop-blur-2xl bg-transparent mx-auto">
        <CardContainer className="inter-var border-1 rounded-2xl  " onClick = {handlemousenter} >
          <CardBody className="bg-transparent  relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-gray-200 dark:text-white"
            >
              CUPOLA VIEW
            </CardItem>

<CardItem translateZ="100" className="w-full mt-4">
      <div className="relative">
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGRxb2o2MmU5M3RrcmtkcDlpMmRpdHFnMGw5bzE4bDBtZTlrdDF6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l5JbspfwZ0yjHjlJ0K/giphy.gif"
          height="1000"
          width="1000"
          className="h-60 w-full object-cover zoom-in-15 rounded-xl group-hover/card:shadow-xl"
          alt="moving earth"
        />
        <img
          src="assets/img4.png"
          height="1000"
          width="1000"
          className="h-60 w-full object-fill rounded-xl group-hover/card:shadow-xl absolute top-0 left-0"
          alt="space station frame"
        />
      </div>
    </CardItem>
            <div className="flex justify-between items-center mt-10">
              <CardItem
                translateZ={20}
                as="button"
                className="w-full h-10 rounded-2xl bg-white text-black hover:bg-gray-100"
                onClick = {handlemousenter}
              >
                Launch Cupola View
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>

        <CardContainer className="inter-var border-1 rounded-2xl ">
          <CardBody className="bg-transparent  relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-gray-200 dark:text-white"
            >
              SPACEWALK SIMULATOR
            </CardItem>

            <CardItem translateZ="100" className="w-full mt-4">
              <img
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHV4MHVyanczbmx3OWFqbWN0NWd1ZGpkdXZwYnVpYXdyYjdsZ2l4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RnDkcqAgnA2E1Lw3z2/giphy.gif"
                height="1000"
                width="1000"
                className="h-60 w-full object-contain rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <div className="flex justify-between items-center mt-10">
              <CardItem
                translateZ={20}
                as="button"
                className="w-full h-10 rounded-2xl bg-white text-black hover:bg-gray-100"
                onClick = {handlemousenter2}
              >
                Launch Simulator
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>

      <div className="flex justify-around w-[100%] space-x-6 mt-9">
        <Button
          variant="outline"
          className="px-8 py-3 border bg-white text-black hover:bg-gray-100"
          onClick={() => handleModuleClick("mission-log")}
        >
          <BookOpen className="w-5 h-5 mr-2" />
          MISSION LOG
        </Button>

        <Button
          variant="outline"
          className="px-8 py-3 border bg-white text-black hover:bg-gray-100"
          onClick={() => handleModuleClick("astronaut-quiz")}
        >
          <Brain className="w-5 h-5 mr-2" />
          ASTRONAUT QUIZ
        </Button>
      </div>
    </div>
  );
}
