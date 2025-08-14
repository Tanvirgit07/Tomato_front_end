"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Plus } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  nickName: z.string().optional(),
  gender: z.string().min(1, { message: "Please select a gender." }),
  country: z.string().min(1, { message: "Please select a country." }),
  language: z.string().min(1, { message: "Please select a language." }),
  timeZone: z.string().min(1, { message: "Please select a time zone." }),
  emailAddresses: z.array(z.object({
    email: z.string().email(),
    isPrimary: z.boolean(),
    addedAt: z.string()
  })).min(1, { message: "At least one email is required." })
});

type FormData = z.infer<typeof formSchema>;

export default function PersonalInformation() {
  const [emails, setEmails] = useState([
    {
      email: 'alexarawles@gmail.com',
      isPrimary: true,
      addedAt: '1 month ago'
    }
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      nickName: '',
      gender: '',
      country: '',
      language: '',
      timeZone: '',
      emailAddresses: emails
    }
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const addEmailAddress = () => {
    const newEmail = {
      email: '',
      isPrimary: false,
      addedAt: 'Just now'
    };
    setEmails([...emails, newEmail]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header Section */}
      <div className="relative mb-8">
        <div className="h-20 bg-gradient-to-r from-blue-200 to-yellow-100 rounded-t-lg"></div>
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-b-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/api/placeholder/64/64" alt="Alexa Rawles" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Alexa Rawles</h2>
              <p className="text-sm text-gray-500">alexarawles@gmail.com</p>
            </div>
          </div>
          <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your First Name" 
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nick Name */}
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nick Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your First Name" 
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Your First Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Your First Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Your First Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Zone */}
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Time Zone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Your First Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC-12">(UTC-12:00) International Date Line West</SelectItem>
                      <SelectItem value="UTC-11">(UTC-11:00) Coordinated Universal Time-11</SelectItem>
                      <SelectItem value="UTC-10">(UTC-10:00) Hawaii</SelectItem>
                      <SelectItem value="UTC-9">(UTC-09:00) Alaska</SelectItem>
                      <SelectItem value="UTC-8">(UTC-08:00) Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="UTC-7">(UTC-07:00) Mountain Time (US & Canada)</SelectItem>
                      <SelectItem value="UTC-6">(UTC-06:00) Central Time (US & Canada)</SelectItem>
                      <SelectItem value="UTC-5">(UTC-05:00) Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="UTC-4">(UTC-04:00) Atlantic Time (Canada)</SelectItem>
                      <SelectItem value="UTC+0">(UTC+00:00) Greenwich Mean Time</SelectItem>
                      <SelectItem value="UTC+1">(UTC+01:00) Central European Time</SelectItem>
                      <SelectItem value="UTC+2">(UTC+02:00) Eastern European Time</SelectItem>
                      <SelectItem value="UTC+8">(UTC+08:00) China Standard Time</SelectItem>
                      <SelectItem value="UTC+9">(UTC+09:00) Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email Addresses Section */}
          <div className="mt-8">
            <Label className="text-sm font-medium text-gray-700 mb-4 block">My email Address</Label>
            <div className="space-y-3">
              {emails.map((emailObj, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={emailObj.isPrimary}
                        className="text-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{emailObj.email}</p>
                        <p className="text-xs text-gray-500">{emailObj.addedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="ghost"
                onClick={addEmailAddress}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-0 h-auto font-normal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Email Address
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}