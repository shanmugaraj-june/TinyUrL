const validateUpdateUrl = (req, res, next) => {

    const { expiresAt } = req.body;

    if (!expiresAt) {
        return res.status(400).json({
            success: false,
            message: "expiresAt is required"
        });
    }

    const expiresDate = new Date(expiresAt);

    if (isNaN(expiresDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid expiresAt date format"
        });
    }

    if (expiresDate.getTime() <= Date.now()) {
        return res.status(400).json({
            success: false,
            message: "expiresAt must be in the future"
        });
    }

    next();
};

module.exports = validateUpdateUrl;