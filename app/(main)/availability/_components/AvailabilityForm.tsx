"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availabilitySchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod/v3";
import { timeSlots } from "../data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { updateAvailability } from "@/actions/availability";

type AvailabilityData = z.infer<typeof availabilitySchema>;

type AvailabilityFormProps = {
  initialData: AvailabilityData;
};

const AvailabilityForm = ({ initialData }: AvailabilityFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<AvailabilityData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    loading,
    error,
    fn: fnUpdateAvailability,
  } = useFetch(updateAvailability);

  const onSubmit = async (data: AvailabilityData) => {
    await fnUpdateAvailability(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {(
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ] as const
      ).map((day) => {
        const isAvailable = watch(`${day}.isAvailable`);
        return (
          <div key={day} className="flex items-center space-x-4 mb-4">
            <Controller
              name={`${day}.isAvailable`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    setValue(`${day}.isAvailable`, isChecked);
                    if (!isChecked) {
                      setValue(`${day}.startTime`, "09:00");
                      setValue(`${day}.endTime`, "17:00");
                    }
                  }}
                />
              )}
            />
            <span className="w-24">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </span>
            {isAvailable && (
              <>
                <Controller
                  name={`${day}.startTime`}
                  control={control}
                  render={({ field }) => {
                    const value = field.value ?? "09:00";
                    return (
                      <Select onValueChange={field.onChange} value={value}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Start Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => {
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <span>to</span>
                <Controller
                  name={`${day}.endTime`}
                  control={control}
                  render={({ field }) => {
                    const value = field.value ?? "17:00";
                    return (
                      <Select onValueChange={field.onChange} value={value}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="End Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => {
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors[day]?.endTime && (
                  <span className="text-red-500 text-sm ml-2">
                    {errors[day].endTime.message}
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="flex items-center space-x-4 mt-5">
        <span className="w-48">Minimum gap before booking (minutes): </span>
        <Input
          className="w-32"
          type="number"
          {...register("timeGap", {
            valueAsNumber: true,
          })}
        />
        {errors?.timeGap && (
          <span className="text-red-500 text-sm ml-2">
            {errors.timeGap.message}
          </span>
        )}
      </div>
      <Button className="mt-5" type="submit">
        Update Availability
      </Button>
    </form>
  );
};

export default AvailabilityForm;
