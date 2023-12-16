"use client"

import React from "react"
import { createCalendar, getLocalTimeZone } from "@internationalized/date"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  DateValue,
  useDateField,
  useDatePicker,
  useDateSegment,
  useLocale,
} from "react-aria"
import {
  DateFieldStateOptions,
  useDateFieldState,
  useDatePickerState,
  type DateFieldState,
  type DatePickerStateOptions,
  type DateSegment,
} from "react-stately"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/* -------------------------------------------------------------------------------------------------
 * DatePicker
 * -----------------------------------------------------------------------------------------------*/

interface DatePickerProps<T extends DateValue = DateValue>
  extends DatePickerStateOptions<T> {
  children?: React.ReactNode
}
export function DatePicker({ children, ...props }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>()
  const state = useDatePickerState({
    shouldCloseOnSelect: true,
    ...props,
    isOpen: open,
    onOpenChange: setOpen,
    onChange: (dateValue) => {
      props.onChange?.(dateValue)
      setDate(dateValue?.toDate(getLocalTimeZone()))
    },
  })
  const ref = React.useRef(null)
  const { groupProps, fieldProps, calendarProps } = useDatePicker(
    props,
    state,
    ref
  )

  children && delete groupProps.onPointerDown

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <div
          {...(children ? groupProps : {})}
          ref={ref}
          className="inline-block"
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[670px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {React.isValidElement(children)
                ? React.cloneElement(children, fieldProps)
                : date
                ? format(date, "PPP")
                : props.label}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-3">
          <Calendar
            mode="single"
            disabled={((date) => date > new Date())}
            initialFocus
            {...calendarProps} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DateField
 * -----------------------------------------------------------------------------------------------*/

interface DateFieldProps<T extends DateValue = DateValue>
  extends Omit<DateFieldStateOptions<T>, "locale" | "createCalendar"> {
  locale?: string
}
export function DateField(props: DateFieldProps) {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })

  const ref = React.useRef(null)
  const { labelProps, fieldProps } = useDateField(props, state, ref)

  return (
    <div>
      <span {...labelProps}>{props.label}</span>
      <div {...fieldProps} ref={ref} className="inline-flex w-full">
        {state.segments.map((segment, index) => (
          <DateSegment key={index} segment={segment} state={state} />
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DateSegment
 * -----------------------------------------------------------------------------------------------*/

interface DateSegmentProps {
  segment: DateSegment
  state: DateFieldState
}
function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = React.useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div
      {...segmentProps}
      ref={ref}
      className="rounded-md px-0.5 text-end tabular-nums outline-none focus:bg-primary focus:text-primary-foreground"
    >
      {segment.text}
    </div>
  )
}
