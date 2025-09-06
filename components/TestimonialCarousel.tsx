"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Product Manager",
    content:
      "SlotMate has simplified how I schedule client demos. No more endless email threads — just quick bookings!",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Priya Sharma",
    role: "HR Specialist",
    content:
      "Interview scheduling is now effortless with SlotMate. Candidates love how smooth the process feels.",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Rohan Iyer",
    role: "Freelance Developer",
    content:
      "As a freelancer, SlotMate helps me manage my time across multiple projects. My clients appreciate the clarity.",
    image: "https://i.pravatar.cc/150?img=13",
  },
  {
    name: "Ananya Gupta",
    role: "Startup Founder",
    content:
      "We run a lean team, and SlotMate has been a lifesaver for coordinating investor and team meetings.",
    image: "https://i.pravatar.cc/150?img=14",
  },
  {
    name: "Karan Patel",
    role: "Sales Executive",
    content:
      "SlotMate boosted my conversions. Prospects can instantly book calls, and I can focus on closing deals.",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

const TestimonialCarousel = () => {
  return (
    <Carousel
      className="w-full w-auto select-none"
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent className="-ml-1">
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="text-gray-600 mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center mt-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(" ").map(n =>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default TestimonialCarousel;
