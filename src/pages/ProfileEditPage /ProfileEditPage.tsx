import { useState, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/modules/Shared/Icons/Icons";
import { CameraIcon } from "@/components/modules/ProfileEdit/CameraIcon";
import { SpinnerIcon } from "@/components/modules/ProfileEdit/SpinnerIcon";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loggedInUserSelector, setUser } from "@/redux/features/auth/authSlice";
import uploadImage from "@/utils/uploadImageToCloudinary";
import { useUpdateUserInfoMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

const ProfileEditPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [updateUserData] = useUpdateUserInfoMutation();
  const dispatch = useAppDispatch();

  // User data state
  const [userData, setUserData] = useState({
    name: loggedInUser?.name || "",
    username: loggedInUser?.username || "",
    bio: loggedInUser?.bio || "",
    email: loggedInUser?.email || "",
    phone: loggedInUser?.phone || "",
    photo: loggedInUser?.photo || "",
  });

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userData.photo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Image must be less than 2MB" });
        return;
      }
      if (!file.type.match("image.*")) {
        setErrors({ ...errors, avatar: "Please select an image file" });
        return;
      }

      const reader = new FileReader();
      setUserImage(file);
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setErrors({ ...errors, avatar: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Upload image to Cloudinary
    let photoUrl = userData.photo;

    if (userImage) {
      const imgUrl = await uploadImage(userImage);
      photoUrl = imgUrl;
    }

    const updatedData = {
      ...userData,
      photo: photoUrl,
    };
    try {
      // Simulate API call
      const res = await updateUserData({
        userId: loggedInUser?.id,
        data: updatedData,
      }).unwrap();
      toast.success("Profile updated successfully!");
      console.log(res);
      dispatch(setUser(res?.data));
      // navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Glass Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size={isMobile ? "icon" : "sm"}
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <Icons.chevronLeft className="h-5 w-5" />
            {!isMobile && <span className="ml-2">Back</span>}
          </Button>

          <h1 className="text-lg font-semibold">Edit Profile</h1>

          <Button
            type="submit"
            form="profile-form"
            size={isMobile ? "sm" : "default"}
            disabled={isLoading}
            className="rounded-full"
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </header>

      {/* Main Content with Card Layout */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <div className="bg-card rounded-xl shadow-sm border p-6 sm:p-8">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Enhanced Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-2 border-primary/10">
                  <AvatarImage
                    src={avatarPreview}
                    className="object-cover"
                    alt="Profile photo"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-3xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "absolute -bottom-2 -right-2 p-3 rounded-full shadow-md",
                    "transition-all duration-200 hover:scale-105",
                    "group-hover:opacity-100 opacity-0 md:opacity-100"
                  )}
                >
                  <CameraIcon className="h-5 w-5" />
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {errors.avatar && (
                <p className="mt-2 text-sm text-destructive">{errors.avatar}</p>
              )}

              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-primary"
              >
                Change profile photo
              </Button>
            </div>

            {/* Form Fields with Improved Spacing */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={
                    errors.name && "border-destructive focus:ring-destructive"
                  }
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground">@</span>
                  </div>
                  <Input
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    className={cn(
                      "pl-8",
                      errors.username &&
                        "border-destructive focus:ring-destructive"
                    )}
                    disabled={isLoading}
                    readOnly={true}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  rows={3}
                  disabled={isLoading}
                  placeholder="Tell your story..."
                />
                <p className="text-sm text-muted-foreground">
                  Max 150 characters
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={
                    errors.email && "border-destructive focus:ring-destructive"
                  }
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="pt-6 border-t">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Danger Zone</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => console.log("Delete account clicked")}
                  className="w-full sm:w-auto"
                >
                  Delete Account
                </Button>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and all associated data
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileEditPage;
