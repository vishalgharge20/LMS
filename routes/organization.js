const express = require('express')
const router = express.Router()
const Admin = require('../models/admins')
const Organization = require('../models/organizations')
const mongoose = require('mongoose')
const Course = require('../models/courses')


// get All Organizations
router.get('/organizations',async(req,res)=>{
    const allOrganization = await Organization.find({}).populate('admins').populate('createdBy')
    res.render('allOrganizationPage',{allOrganization})
})


// get organizationBY Id
router.get('/organizations/:id',async(req,res)=>{
    const {id} = req.params
    const allCourses = await Course.find({})
    const organization = await Organization.findById(id).populate('admins').populate('createdBy')
    res.render('organizationDetail',{organization,allCourses})
})


// go to updateOrganizationPage
router.get('/organizations/:id/update',async(req,res)=>{
    const {id} = req.params
    const allCourses = await Course.find({})
    const availableAdmins = await Admin.find({ role: 'admin', organization: id });
    const currentOrganization = await Organization.findById(id).populate('admins')
    res.render('updateOrganizationPage',{ organization: currentOrganization, availableAdmins,allCourses })
})


router.put('/organizations/:id/update', async (req, res) => {
    const { name, description } = req.body; // Get the name and description from request body
    const { id } = req.params; // Get the organization ID from request params
    const organization = await Organization.findById(id).populate('admins');
    // Attempt to update the organization
    try {
        await Organization.findByIdAndUpdate(id, { name, description });
        res.redirect(`/organizations/${id}`)
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).send("Internal Server Error");
    }
});



// router.put('/organizations/:id/update', async (req, res) => {
//     const { name, description, courses } = req.body; // Get name, description, and courses from the request body
//     const { id } = req.params; // Get the organization ID from request params
//     const organization = await Organization.findById(id).populate('admins');

//     try {
//         // Update the organization details
//         await Organization.findByIdAndUpdate(id, { name, description });

//         // Update the assigned courses if any are provided
//         if (Array.isArray(courses)) {
//             await Organization.findByIdAndUpdate(id, { $set: { courses: courses } }); // Update courses array
//         }

//         res.redirect(`/organizations/${id}`);
//     } catch (error) {
//         console.error("Error updating organization:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


// create an Admin
router.post('/organizations/:id/newAdmin',async(req,res)=>{
const { id } = req.params; // Get organization ID from URL
const currentOrganization = await Organization.findById(id)
const {adminUsername,adminEmail,adminPassword} = req.body
    const newAdmin = new Admin({
            username:adminUsername,
            email:adminEmail,
            password:adminPassword,
            organization: id 
            })
        await newAdmin.save()
        currentOrganization.admins.push(newAdmin._id);
        await currentOrganization.save(); // Save the organization after pushing the new admin ID
        res.redirect(`/organizations/${id}/update`)
})


// Delete an Admin 
router.delete('/organizations/:id/removeAdmin', async (req, res) => {
    const { id } = req.params; // Get organization ID from URL
    const { adminId } = req.body; // Get admin ID from request bod
    try{
        await Admin.deleteOne({ _id: adminId }); // Delete admin by ID
    res.redirect(`/organizations/${id}/update`); // Redirect to organizations page
    }
    catch(err){
        console.error("Error fetching admins:", err);
        res.status(500).send("Error loading form");
    }  
});


/// delete Organization 
router.delete('/organizations/:id/delete',async(req,res)=>{
    const {id} = req.params
    try{
        const organizationAdmins = await Admin.deleteMany({organization:id})
        // organizationAdmins are getting deleted correctly but wrong Organization is getting deleted
        const foundOrg = await Organization.findById(id)
        await Organization.deleteOne({_id:foundOrg.id})
        res.redirect('/organizations')
    }   
    catch(err){
        console.error("Error Deleting Organization:", err);
        res.status(500).send("Error Deleting");
    }  
})



// router.post('/organizations/:id/update/assign-courses', async (req, res) => {
    
// })










// get newOrganizationPage
router.get('/newOrganizationPage',async(req,res)=>{
    try{
        const availableAdmins = await Admin.find({ role: 'admin', organization: null });
        res.render('newOrganizationPage',{availableAdmins})
    }
    catch(err){
        console.error("Error fetching admins:", err);
        res.status(500).send("Error loading form");
    }
    
})


// post newOrganization
router.post('/createOrganization', async (req, res) => {
    const { name, description, admin, adminUsername, adminEmail, adminPassword } = req.body;

    try {
        // Step 1: Create and save a new organization
        const newOrganization = new Organization({
            name,
            description
        });
        await newOrganization.save();

        // Step 2: Check if an existing admin was selected
        if (admin) {
            // Fetch and add the selected admin to the organization
            const selectedAdmin = await Admin.findById(admin);
            if (!selectedAdmin) {
                return res.status(404).send("Selected admin not found");
            }

            newOrganization.admins.push(selectedAdmin._id);
            selectedAdmin.organization = newOrganization._id;
            await selectedAdmin.save();
            console.log('Added existing admin:', selectedAdmin);

        } else if (adminUsername && adminEmail && adminPassword) {
            // Step 3: Create a new admin if no existing admin is selected
            const newAdmin = new Admin({
                username: adminUsername,
                email: adminEmail,
                password: adminPassword,
                organization: newOrganization._id
            });
            await newAdmin.save();

            newOrganization.admins.push(newAdmin._id);
            console.log('Created and added new admin:', newAdmin);
        }

        // Step 4: Save the organization with the updated admin information
        await newOrganization.save();
        console.log('New Organization:', newOrganization);
        res.send('Organization and admin created successfully');

    } catch (err) {
        console.error("Error Creating Organization:", err);
        res.status(500).send("Error Creating Organization");
    }
});



// get new admin page
router.get('/newAdminPage',(req,res)=>{
    res.render('newAdminPage')
})



// post admin
router.post('/createAdmin',async(req,res)=>{
    const {adminUsername,adminEmail,adminPassword} = req.body
            newAdmin = new Admin({
                username:adminUsername,
                email:adminEmail,
                password:adminPassword,
            })
            await newAdmin.save()
            res.redirect('/')
})




module.exports = router;